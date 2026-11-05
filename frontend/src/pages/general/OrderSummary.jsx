import { useEffect, useState } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import '../../styles/order-summary.css'
import axios from 'axios'

const OrderSummary = () => {
  const { foodId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [food, setFood] = useState(location.state?.food || null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(!location.state?.food)

  useEffect(() => {
    if (food) return

    axios.get('https://foodview-api.onrender.com/api/food')
      .then((response) => {
        const item = response.data.foodItems.find(
          (food) => food._id === foodId
        )
        setFood(item || null)
      })
      .catch((error) => {
        console.error('Error fetching food:', error)
      })
      .finally(() => setLoading(false))
  }, [food, foodId])

  if (loading) {
    return <h2>Loading order summary...</h2>
  }

  if (!food) {
    return <h2>Food item not found.</h2>
  }

  const price = Number(food.price)
  const validPrice = Number.isFinite(price) && price > 0
  const total = price * quantity

  return (
    <div className="order-summary-page">

      <div className="order-summary-card">

        <h1>Order Summary</h1>

        <img
          src={food.thumbnail || ''}
          alt={food.name}
          className="order-food-image"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />

        <h2>{food.name}</h2>

        <p>{food.description}</p>

        <h3>
          Price: {validPrice ? `₹${price}` : 'Price unavailable'}
        </h3>

        <div className="quantity-control">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            -
          </button>

          <span>{quantity}</span>

          <button
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </button>
        </div>

        <div className="order-total">
          <span>Total Amount</span>
          <strong>
            {validPrice ? `₹${total.toFixed(2)}` : 'Unavailable'}
          </strong>
        </div>

        {!validPrice && (
          <p className="order-error">
            This food does not have a saved price yet.
            Please update its price before ordering.
          </p>
        )}

        <button
          className="proceed-payment-btn"
          disabled={!validPrice}
          onClick={() => navigate('/payment', {
            state: {
              food,
              quantity,
              total
            }
          })}
        >
          Proceed to Payment
        </button>

        <button
          className="back-btn"
          onClick={() => navigate('/')}
        >
          Back to FoodView
        </button>

      </div>
    </div>
  )
}

export default OrderSummary