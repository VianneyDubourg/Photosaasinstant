export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-night-900 py-6">
      <div className="max-w-6xl mx-auto px-4 text-center text-white/30 text-sm">
        <p>&copy; {new Date().getFullYear()} PhotoInstant. All rights reserved.</p>
      </div>
    </footer>
  )
}
