export interface Order {
    id: number
    buyerEmail: string
    shippingAddress: ShippingAddress
    orderDate: string
    orderItems: OrderItem[]
    subtotal: number
    deliveryFee: number
    discount: number
    paymentIntentId: string
    orderStatus: number
    paymentSummary: PaymentSummary
    total: number
}

export interface ShippingAddress {
    name: string
    line1: string
    line2?: string | null
    city: string
    state: string
    postal_code: string
    country: string
}

export interface OrderItem {
    id: number
    itemOrdered: ItemOrdered
    price: number
    quantity: number
    name: string
    pictureUrl : string
    
}

export interface ItemOrdered {
    productId: number
    name: string
    pictureUrl: string
}

export interface PaymentSummary {
    last4: number | string
    brand: string
    exp_month: number
    exp_year: number
}
export interface CreateOrder {
    shippingAddress: ShippingAddress
    paymentSummary: PaymentSummary
}
