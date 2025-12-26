export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} Camarote da Acessibilidade. Todos os direitos reservados.
          </p>
          <p className="mt-2 md:mt-0">
            Sistema desenvolvido por{' '}
            <span className="font-bold text-gray-800">DDV Technology</span>
          </p>
        </div>
      </div>
    </footer>
  )
}


