/*
 * PrototypeBanner — slim release notice pinned above all app chrome.
 * Sits at the very top (z above the nav header) on every screen that uses the
 * Layout shell. The "Learn more" sentence is a link; its href is a placeholder
 * until a destination URL is provided.
 */
export const PrototypeBanner = () => (
  <div className="fixed top-0 left-0 right-0 z-[60] h-7 flex items-center justify-center gap-1 px-3 bg-green-50 border-b border-green-700 detail-100 text-green-900">
    <span>This is a prototype of our Aug 3rd release.</span>
    <a className="underline cursor-pointer text-green-800 hover:text-green-900">
      Learn more about this release.
    </a>
  </div>
);
