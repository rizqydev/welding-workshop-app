// components/Sidebar.js
export default function Sidebar() {
  return (
    <div className="bg-white shadow h-full p-4 w-60 flex flex-col">
      <div className="font-bold text-xl mb-10">SMS App</div>
      <nav className="flex flex-col gap-2">
        <a className="px-3 py-2 rounded text-blue-600 bg-blue-100 font-semibold">Modern</a>
        <div className="mt-4">
          <div className="text-xs mb-2 text-gray-400 uppercase">Form</div>
          <a className="block px-3 py-1 text-gray-700 hover:bg-gray-100 rounded">Forms Elements</a>
          <a className="block px-3 py-1 text-blue-600 font-semibold">Forms Horizontal</a>
          <a className="block px-3 py-1 text-gray-700 hover:bg-gray-100 rounded">Forms Vertical</a>
          <a className="block px-3 py-1 text-gray-700 hover:bg-gray-100 rounded">Forms Custom</a>
          <a className="block px-3 py-1 text-gray-700 hover:bg-gray-100 rounded">Form Validation</a>
        </div>
      </nav>
    </div>
  )
}
