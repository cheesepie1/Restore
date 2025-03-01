import { Order, ShippingAddress } from "../app/models/order"

export function currencyFormat(amount: number) {
    return '$' + (amount / 100).toFixed(2)
}
export function filterEmptyValues(values: object) {
    return Object.fromEntries(
        Object.entries(values).filter(
            ([, value]) => value !== '' && value !== null && value !== undefined && value.length !== 0
        )
    )
}

export function AddressString(address: ShippingAddress) {
  
    return `${address?.name}, ${address?.line1}, ${address?.city}, ${address?.state}, 
            ${address?.postal_code}, ${address?.country}`
}

export function PaymentString (order: Order) {
    return `${order.paymentSummary?.brand.toUpperCase()}, **** **** **** ${order.paymentSummary?.last4},    
        Exp ${order.paymentSummary?.exp_month}/${order.paymentSummary?.exp_year}`
}