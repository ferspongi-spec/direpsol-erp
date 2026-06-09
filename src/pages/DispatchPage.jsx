import Layout from "../components/Layout";

function DispatchPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">

        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          Despacho de Balones
        </h1>

        <div className="bg-white rounded-2xl p-8 shadow-sm">

          <h2 className="text-2xl font-bold mb-4">
            Módulo de Despacho
          </h2>

          <p className="text-gray-500">
            Aquí se asignarán balones de 10 Kg y 45 Kg a los vendedores.
          </p>

        </div>

      </div>
    </Layout>
  );
}

export default DispatchPage;