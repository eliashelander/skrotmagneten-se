/**
 * A side bar component with Overlay that works without JavaScript.
 * @example
 * ```jsx
 * <Aside id="search-aside" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  id = 'aside',
}: {
  children?: React.ReactNode;
  bottomChildren?: React.ReactNode;
  heading: React.ReactNode;
  id?: string;
}) {
  return (
    <div aria-modal className="overlay z-50" id={id} role="dialog">
      <button
        className="close-outside"
        onClick={() => {
          history.go(-1);
        }}
      />
      <aside className="fixed top-0 bg-[#f4f2e9] h-screen w-screen sm:w-[90%] sm:max-w-6xl transform ease-in-out duration-200">
        <header className="flex items-center h-16 justify-between px-5 border-b border-black">
          <h3 className="m-0">{heading}</h3>
          <CloseAside />
        </header>
        <main className="pt-4">{children}</main>
      </aside>
    </div>
  );
}

function CloseAside() {
  return (
    <button className="close" onClick={() => history.go(-1)}>
      &times;
    </button>
  );
}
