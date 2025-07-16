// This took a lot of time so created a separate component for this

import { useState, useEffect } from "react"

function AdminDashboard() {
  const [orders, setOrders] = useState([])

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:3000/orders")
    const data = await res.json()
    setOrders(data)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Super Admin Dashboard</h2>
      <button onClick={fetchOrders} style={{ marginBottom: "20px" }}>
        Refresh
      </button>
      <table border='1' cellPadding='10' style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Buyer Email</th>
            <th>Price (₹)</th>
            <th>Purchase Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{order.productName}</td>
              <td>{order.buyerEmail}</td>
              <td>{order.price}</td>
              <td>{new Date(order.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminDashboard
