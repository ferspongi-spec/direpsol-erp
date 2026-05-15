import { useEffect, useState } from "react";

import {
  createFise,
  getFise,
  updateFiseStatus,
} from "../services/fiseService";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "../firebase/config";
function FisePage() {

  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState("");
  const [type, setType] = useState("10kg");
  const [image, setImage] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadFise();
  }, []);

  // cargar registros
  const loadFise = async () => {
    const data = await getFise();
    setRecords(data);
  };

  // cambiar estado
  const handleStatusChange = async (
    id,
    status
  ) => {

    await updateFiseStatus(id, status);

    loadFise();
  };

  // guardar vale
  const handleSave = async () => {

    if (!voucher || !discount) return;
let imageUrl = "";

if (image) {

  const imageRef = ref(
    storage,
    `fise/${Date.now()}-${image.name}`
  );

  await uploadBytes(imageRef, image);

  imageUrl =
    await getDownloadURL(imageRef);
}
    await createFise({
      voucher,
      discount: Number(discount),
      type,
      status: "Pendiente",
      vendor:
        JSON.parse(
          localStorage.getItem("seller")
        )?.name || "Sin vendedor",
        imageUrl,
    });

    setVoucher("");
    setDiscount("");

    loadFise();
  };

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        Módulo FISE
      </h1>

      {/* Formulario */}
      <div className="bg-white p-6 rounded-xl shadow max-w-md space-y-4 mb-8">

        <input
          type="text"
          placeholder="Código Vale FISE"
          value={voucher}
          onChange={(e) =>
            setVoucher(e.target.value)
          }
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          placeholder="Monto descuento"
          value={discount}
          onChange={(e) =>
            setDiscount(e.target.value)
          }
          className="w-full border p-3 rounded"
        />

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
          className="w-full border p-3 rounded"
        >

          <option value="10kg">
            GLP 10 Kg
          </option>

          <option value="45kg">
            GLP 45 Kg
          </option>

        </select>
<input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setImage(e.target.files[0])
  }
  className="w-full border p-3 rounded bg-white"
/>
        <button
          onClick={handleSave}
          className="w-full bg-orange-500 text-white p-3 rounded font-bold"
        >
          Registrar Vale
        </button>

      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-blue-900 text-white">

            <tr>

              <th className="p-4 text-left">
                Vale
              </th>

              <th className="p-4 text-left">
                Descuento
              </th>

              <th className="p-4 text-left">
                Tipo
              </th>

              <th className="p-4 text-left">
                Estado
              </th>

              <th className="p-4 text-left">
                Vendedor
              </th>
<th className="p-4 text-left">
  Evidencia
</th>
            </tr>

          </thead>

          <tbody>

            {records.map((item) => (

              <tr
                key={item.id}
                className="border-b"
              >

                <td className="p-4">
                  {item.voucher}
                </td>

                <td className="p-4">
                  S/ {item.discount}
                </td>

                <td className="p-4">
                  {item.type}
                </td>

                <td className="p-4">

                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(
                        item.id,
                        e.target.value
                      )
                    }
                    className="border rounded p-2"
                  >

                    <option value="Pendiente">
                      Pendiente
                    </option>

                    <option value="En proceso">
                      En proceso
                    </option>

                    <option value="Aprobado">
                      Aprobado
                    </option>

                    <option value="Rechazado">
                      Rechazado
                    </option>

                  </select>

                </td>

                <td className="p-4">
                  {item.vendor}
                </td>
                 <td className="p-4">

  {item.imageUrl && (

    <a
      href={item.imageUrl}
      target="_blank"
      rel="noreferrer"
    >

      <img
        src={item.imageUrl}
        alt="evidencia"
        className="w-16 h-16 object-cover rounded"
      />

    </a>

  )}

</td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}

export default FisePage;