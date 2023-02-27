import { useEffect, useState } from "react"
import "./App.css"
export default function App() {
  const [input, setInput] = useState({
    asal: "",
    tujuan: "",
    harga: 0,
    jumlah_penumpang: 0,
    tanggal_jam: new Date()
  })
  const [selected, setSelected] = useState(-1)
  const [data, setData] = useState([])
  function handleChange(ev) {
    setInput({
      ...input,
      [ev.target.name]: ev.target.type == "number" ? parseInt(ev.target.value) : ev.target.value
    })
  }
  useEffect(() => {
    getData()
  }, [])
  async function hapus(id) {
    try {
      const res = await fetch("/api/"+id, {
        method: "Delete"
      })
      if (res.ok) {
        getData()
      }
    }
    catch (err) {
      console.log(err)
    }
  }
  async function getData() {
    try {
      const res = await fetch("/api")
      if (!res.ok) return
      const data = await res.json()
      setData(data)
    } catch (err) {
      console.error(err)
    }
  }
  async function handleSubmit(ev) {
    ev.preventDefault()
    try {
      const isEdit = selected>=0
      const res = await fetch(isEdit ? "/api/"+selected: "/api", {
        method:  isEdit ? "PUT":"POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
      })
      if (!res.ok) return
      alert("Success")
      getData()
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      <h1 align="center">Travel</h1>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid'
      }}>
        <div>
          <label htmlFor="tanggal_jam">Tanggal : </label>
          <input type="date" value={input.tanggal_jam} id="tanggal_jam" name="tanggal_jam" onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="asal">Asal : </label>
          <input type="text" value={input.asal} id="tanggal" name="asal" onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="tujuan">Tujuan : </label>
          <input type="text" value={input.tujuan} id="tujuan" name="tujuan" onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="harga">Harga : </label>
          <input type="number" value={input.harga} id="harga" name="harga" onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="jumlah_penumpang">Jumlah Penumpang : </label>
          <input type="number" value={input.jumlah_penumpang} id="jumlah_penumpang" name="jumlah_penumpang" onChange={handleChange} />
        </div>
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <button type="submit">{selected >= 0 ? "Edit" : "Tambah"}</button>
        </div>
      </form>
      <table border={1} cellPadding={10} cellSpacing={0} style={{ width: "100%" }}>
        <thead>
          <th>#</th>
          <th>Asal</th>
          <th>Tujuan</th>
          <th>Harga</th>
          <th>Jumlah Penumpang</th>
          <th>Tanggal</th>
          <th>Aksi</th>
        </thead>
        <tbody>
          {
            data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.asal}</td>
                <td>{item.tujuan}</td>
                <td>{item.harga.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
                <td>{item.jumlah_penumpang}</td>
                <td>{new Date(item.tanggal_jam).toLocaleString()}</td>
                <td>
                  <button onClick={() => {
                    hapus(item.id)
                  }} >Hapus</button>
                  <button onClick={() => {
                    setInput(item)
                    setSelected(item.id)
                  }}>Edit</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </>
  )
}