import type { Metadata } from "next";
import { StatesGallery } from "./StatesGallery";

export const metadata: Metadata = { title: "State previews", robots: { index: false, follow: false } };

export default function DevStatesPage() {
  return <StatesGallery />;
}
