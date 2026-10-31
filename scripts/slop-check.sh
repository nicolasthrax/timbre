#!/usr/bin/env bash
# slop-check.sh: flag hard-ban AI-tell vocabulary and em dashes in prose and UI copy.
# Usage: scripts/slop-check.sh FILE...   Exit 1 if anything is found, else 0.
# Needs GNU grep (on macOS: brew install grep, then set GREP=ggrep).
set -u
GREP="${GREP:-grep}"
EMDASH=$(printf '\342\200\224')
PATTERNS=(
  'delv(e|es|ed|ing)' 'underscor(e|es|ed|ing)' 'showcas(e|es|ed|ing)'
  'emphasi[sz](e|es|ed|ing)' 'enhanc(e|es|ed|ing)' 'leverag(e|es|ed|ing)'
  'foster(s|ed|ing)?' 'bolster(s|ed|ing)?' 'garner(s|ed|ing)?' 'boast(s|ed|ing)?'
  'elevat(e|es|ing)' 'unveil(s|ed|ing)?' 'revolutioni[sz](e|es|ed|ing)'
  'encompass(es|ed|ing)?' 'elucidat(e|es|ed|ing)' 'streamlin(e|es|ed|ing)'
  'pivotal' 'intricate(ly)?' 'intricacies' 'meticulous(ly)?' 'commendable'
  'vibrant(ly)?' 'multifaceted' 'groundbreaking' 'transformative'
  'seamless(ly)?' 'invaluable' 'noteworthy' 'holistic(ally)?'
  'tapestr(y|ies)' 'realms?' 'testament' 'interplay' 'synerg(y|ies)'
  'paradigms?' 'advancements'
  'moreover' 'furthermore' 'notably'
  "in today.?s (fast-paced|digital)" "let.?s dive" 'dive into'
  'great question' "you.?re absolutely right" "i.?d be happy to"
  "it.?s (important|worth) not(e|ing)" 'it is (important|worth) not(e|ing)'
  'plays? an? (pivotal|vital|crucial|key|significant) role'
  'in conclusion' 'in summary' 'i hope this helps' 'as an ai language model'
  'let me know if you have any (other |further )?questions'
  'as of my last (knowledge|training) update' 'turn0search'
  "(it|this|that)(.?s| is| was) not [^.;:]{1,50}, (it|this|that).?s"
  "(it|this|that) (isn.?t|wasn.?t) [^.;:]{1,50}, (it|this|that).?s"
  'not (just|merely) [^.;:]{1,50}, but'
  'no [a-z]+, no [a-z]+, just'
)
RE="\\b($(IFS='|'; echo "${PATTERNS[*]}"))\\b|(^|[.!?][[:space:]]+)(additionally,|certainly[!,])"
status=0
for f in "$@"; do
  [ -f "$f" ] || continue
  case "$(basename "$f")" in
    AGENTS.md|CLAUDE.md|*slop*) continue ;;  # the rule files and word list
    *.md|*.mdx|*.txt|*.rst|*.html|*.jsx|*.tsx|*.vue|*.svelte|*.astro) ;;
    *) continue ;;
  esac
  hits=$("$GREP" -n -- "$EMDASH" "$f" | sed "s|^|$f:em-dash:|")
  [ -n "$hits" ] && { echo "$hits"; status=1; }
  hits=$("$GREP" -n -i -E -- "$RE" "$f" | sed "s|^|$f:word:|")
  [ -n "$hits" ] && { echo "$hits"; status=1; }
done
exit $status
