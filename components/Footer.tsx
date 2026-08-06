export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.06] py-10 px-6">
      <div className="w-full flex items-center justify-center text-center">
        <span className="text-white/30 text-xs font-mono block mx-auto text-center">
          © {new Date().getFullYear()} Mustafijur Rahman. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
