import { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom"
import { auth, provider, signInWithPopup } from "./firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import products from "./products"
import AdminDashboard from "./AdminDashboard"

function LoginPage() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then(result => {
        const loggedInUser = result.user
        setUser({
          name: loggedInUser.displayName,
          email: loggedInUser.email,
          photo: loggedInUser.photoURL,
        })
        localStorage.setItem("userEmail", loggedInUser.email)
        navigate("/products")
      })
      .catch(error => console.error("Google Login Error:", error))
  }

  useEffect(() => {
    onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        navigate("/products")
      }
    })
  }, [])

  return (
    <div style={styles.centeredPage}>
      <button onClick={handleLogin} style={styles.loginButton}>
        Sign in with Google
      </button>
    </div>
  )
}

function ProductsPage() {
  const navigate = useNavigate()

  const handleBuy = async product => {
    const userEmail = localStorage.getItem("userEmail")
    try {
      const response = await fetch(
        "http://localhost:3000/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product, userEmail }),
        }
      )

      const data = await response.json()
      window.location.href = data.url
    } catch (error) {
      console.error("Checkout Error:", error)
    }
  }

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/"))
  }

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
      <h2>Products</h2>
      <div style={styles.grid}>
        {products.map(product => (
          <div key={product.id} style={styles.productCard}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>₹{product.price}</p>
            <button onClick={() => handleBuy(product)} style={styles.buyButton}>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function SuccessPage() {
  const navigate = useNavigate()
  return (
    <div style={styles.centeredPage}>
      <h1 style={{ color: "green" }}>✅ Payment Successful!</h1>
      <p>Thank you for your purchase.</p>
      <button onClick={() => navigate("/products")} style={styles.backButton}>
        Go to Products
      </button>
    </div>
  )
}

function CancelPage() {
  const navigate = useNavigate()
  return (
    <div style={styles.centeredPage}>
      <h1 style={{ color: "red" }}>❌ Payment Cancelled!</h1>
      <p>Your payment was not completed.</p>
      <button onClick={() => navigate("/products")} style={styles.backButton}>
        Go to Products
      </button>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/products' element={<ProductsPage />} />
        <Route path='/success' element={<SuccessPage />} />
        <Route path='/cancel' element={<CancelPage />} />
        <Route path='/admin' element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

const styles = {
  centeredPage: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    // flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#1a1a1a",
  },
  loginButton: {
    backgroundColor: "#4285F4",
    color: "#fff",
    padding: "12px 24px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  logoutButton: {
    backgroundColor: "#555",
    color: "#fff",
    padding: "8px 16px",
    fontSize: "14px",
    border: "none",
    borderRadius: "6px",
    marginBottom: "20px",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  },
  productCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    color: "#000",
  },
  buyButton: {
    backgroundColor: "#22c55e",
    color: "#fff",
    padding: "8px",
    border: "none",
    borderRadius: "4px",
    marginTop: "10px",
    width: "100%",
    cursor: "pointer",
  },
}

export default App
