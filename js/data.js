/**
 * Delizioso Restaurant Demo - Dummy Data
 * This file contains all the mock data for the restaurant platform
 */

// Products data
const products = [
    {
        id: 1,
        name: "Margherita Pizza",
        category: "pizza",
        price: 14.99,
        description: "Fresh mozzarella, tomato sauce, basil, and olive oil on our signature crust.",
        image: "images/Chicken wings.jfif",
        rating: 4.8,
        popular: true,
        ingredients: ["Mozzarella", "Tomato Sauce", "Basil", "Olive Oil"],
        calories: 850,
        prepTime: "15 mins"
    },
    {
        id: 2,
        name: "Pepperoni Pizza",
        category: "pizza",
        price: 16.99,
        description: "Classic pepperoni with mozzarella and tomato sauce on a crispy crust.",
        image: "images/Dynamite.jfif",
        rating: 4.9,
        popular: true,
        ingredients: ["Pepperoni", "Mozzarella", "Tomato Sauce"],
        calories: 920,
        prepTime: "15 mins"
    },
    {
        id: 3,
        name: "Carbonara Pasta",
        category: "pasta",
        price: 18.99,
        description: "Creamy pasta with pancetta, eggs, parmesan, and black pepper.",
        image: "images/modberger.jpg",
        rating: 4.7,
        popular: true,
        ingredients: ["Spaghetti", "Pancetta", "Eggs", "Parmesan", "Black Pepper"],
        calories: 780,
        prepTime: "12 mins"
    },
    {
        id: 4,
        name: "Pesto Pasta",
        category: "pasta",
        price: 16.99,
        description: "Fresh basil pesto with cherry tomatoes, pine nuts, and parmesan.",
        image: "images/modecheckin.jfif",
        rating: 4.6,
        popular: false,
        ingredients: ["Penne", "Basil Pesto", "Cherry Tomatoes", "Pine Nuts", "Parmesan"],
        calories: 720,
        prepTime: "10 mins"
    },
    {
        id: 5,
        name: "Caesar Salad",
        category: "salad",
        price: 12.99,
        description: "Crisp romaine lettuce with caesar dressing, croutons, and parmesan.",
        image: "images/Mozzarila.jfif",
        rating: 4.5,
        popular: false,
        ingredients: ["Romaine Lettuce", "Caesar Dressing", "Croutons", "Parmesan"],
        calories: 320,
        prepTime: "8 mins"
    },
    {
        id: 6,
        name: "Caprese Salad",
        category: "salad",
        price: 13.99,
        description: "Fresh tomatoes, mozzarella, basil, and balsamic glaze.",
        image: "images/modberger.jpg",
        rating: 4.4,
        popular: false,
        ingredients: ["Tomatoes", "Mozzarella", "Basil", "Balsamic Glaze"],
        calories: 280,
        prepTime: "5 mins"
    },
    {
        id: 7,
        name: "Tiramisu",
        category: "dessert",
        price: 8.99,
        description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone.",
        image: "images/dessert-tiramisu.jpg",
        rating: 4.9,
        popular: true,
        ingredients: ["Ladyfingers", "Mascarpone", "Coffee", "Cocoa"],
        calories: 420,
        prepTime: "5 mins"
    },
    {
        id: 8,
        name: "Cannoli",
        category: "dessert",
        price: 6.99,
        description: "Crispy pastry shells filled with sweet ricotta cream.",
        image: "images/tacosalad.jfif",
        rating: 4.8,
        popular: false,
        ingredients: ["Pastry Shell", "Ricotta", "Sugar", "Chocolate Chips"],
        calories: 280,
        prepTime: "2 mins"
    },
    {
        id: 9,
        name: "Italian Soda",
        category: "drink",
        price: 4.99,
        description: "Sparkling water with your choice of Italian syrup flavor.",
        image: "images/drink-soda.jpg",
        rating: 4.3,
        popular: false,
        ingredients: ["Sparkling Water", "Italian Syrup"],
        calories: 120,
        prepTime: "2 mins"
    },
    {
        id: 10,
        name: "Espresso",
        category: "drink",
        price: 3.99,
        description: "Authentic Italian espresso made from premium beans.",
        image: "images/drink-espresso.jpg",
        rating: 4.7,
        popular: true,
        ingredients: ["Premium Coffee Beans"],
        calories: 5,
        prepTime: "1 min"
    },
    {
        id: 11,
        name: "Lasagna",
        category: "pasta",
        price: 19.99,
        description: "Layers of pasta, meat sauce, ricotta, and mozzarella baked to perfection.",
        image: "images/pasta-lasagna.jpg",
        rating: 4.8,
        popular: true,
        ingredients: ["Pasta Sheets", "Ground Beef", "Ricotta", "Mozzarella", "Tomato Sauce"],
        calories: 950,
        prepTime: "20 mins"
    },
    {
        id: 12,
        name: "Gelato",
        category: "dessert",
        price: 7.99,
        description: "Authentic Italian gelato in various flavors.",
        image: "images/modberger.jpg",
        rating: 4.9,
        popular: true,
        ingredients: ["Milk", "Sugar", "Flavorings"],
        calories: 180,
        prepTime: "2 mins"
    }
];

// Admin dashboard stats
const dashboardStats = [
    {
        id: "total_orders",
        title: "Total Orders",
        value: "1,247",
        change: "+12%",
        changeType: "positive",
        icon: "fas fa-shopping-cart",
        color: "primary"
    },
    {
        id: "total_revenue",
        title: "Total Revenue",
        value: "$24,680",
        change: "+8%",
        changeType: "positive",
        icon: "fas fa-dollar-sign",
        color: "success"
    },
    {
        id: "active_customers",
        title: "Active Customers",
        value: "892",
        change: "+15%",
        changeType: "positive",
        icon: "fas fa-users",
        color: "info"
    },
    {
        id: "avg_rating",
        title: "Average Rating",
        value: "4.8",
        change: "+0.2",
        changeType: "positive",
        icon: "fas fa-star",
        color: "warning"
    },
    {
        id: "menu_views",
        title: "Menu Views",
        value: "15,420",
        change: "+25%",
        changeType: "positive",
        icon: "fas fa-eye",
        color: "secondary"
    },
    {
        id: "conversion_rate",
        title: "Conversion Rate",
        value: "3.2%",
        change: "-0.1%",
        changeType: "negative",
        icon: "fas fa-chart-line",
        color: "danger"
    }
];

// Advertisements data
const advertisements = [
    {
        id: 1,
        title: "Family Dinner Special",
        description: "Bring your family for our special 4-course meal. 20% off for groups of 4 or more!",
        image: "images/ad-family.jpg",
        active: true,
        startDate: "2024-01-15",
        endDate: "2024-02-15",
        targetAudience: "Families",
        impressions: 2450,
        clicks: 89
    },
    {
        id: 2,
        title: "Lunch Special",
        description: "Enjoy our daily lunch specials from 11 AM to 3 PM. Pasta dishes at $12.99!",
        image: "images/ad-lunch.jpg",
        active: true,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        targetAudience: "Business Professionals",
        impressions: 1890,
        clicks: 156
    },
    {
        id: 3,
        title: "Weekend Brunch",
        description: "Start your weekend right with our delicious brunch menu. Live music every Sunday!",
        image: "images/ad-brunch.jpg",
        active: true,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        targetAudience: "All Ages",
        impressions: 3200,
        clicks: 234
    },
    {
        id: 4,
        title: "Valentine's Day Special",
        description: "Romantic dinner for two with wine pairing and dessert. Limited time offer!",
        image: "images/ad-valentine.jpg",
        active: false,
        startDate: "2024-02-10",
        endDate: "2024-02-15",
        targetAudience: "Couples",
        impressions: 890,
        clicks: 67
    }
];

// Recent orders data
const recentOrders = [
    {
        id: 1001,
        customerName: "John Smith",
        items: ["Margherita Pizza", "Caesar Salad"],
        total: 27.98,
        status: "preparing",
        orderTime: "2024-01-16 14:30",
        orderType: "dine-in",
        tableNumber: 5
    },
    {
        id: 1002,
        customerName: "Sarah Johnson",
        items: ["Carbonara Pasta", "Tiramisu", "Italian Soda"],
        total: 31.97,
        status: "ready",
        orderTime: "2024-01-16 14:15",
        orderType: "delivery",
        address: "123 Main St, Apt 4B"
    },
    {
        id: 1003,
        customerName: "Mike Wilson",
        items: ["Pepperoni Pizza", "Cannoli"],
        total: 23.98,
        status: "completed",
        orderTime: "2024-01-16 13:45",
        orderType: "takeout",
        pickupTime: "ASAP"
    },
    {
        id: 1004,
        customerName: "Emma Davis",
        items: ["Pesto Pasta", "Gelato"],
        total: 24.98,
        status: "preparing",
        orderTime: "2024-01-16 14:45",
        orderType: "dine-in",
        tableNumber: 3
    },
    {
        id: 1005,
        customerName: "Robert Brown",
        items: ["Lasagna", "Espresso"],
        total: 23.98,
        status: "ready",
        orderTime: "2024-01-16 14:20",
        orderType: "dine-in",
        tableNumber: 7
    }
];

// Categories for filtering
const categories = [
    { id: "all", name: "All", icon: "fas fa-th-large" },
    { id: "pizza", name: "Pizza", icon: "fas fa-pizza-slice" },
    { id: "pasta", name: "Pasta", icon: "fas fa-utensils" },
    { id: "salad", name: "Salads", icon: "fas fa-leaf" },
    { id: "dessert", name: "Desserts", icon: "fas fa-birthday-cake" },
    { id: "drink", name: "Drinks", icon: "fas fa-glass-martini" }
];

// Payment methods
const paymentMethods = [
    { id: "cash", name: "Cash", icon: "fas fa-money-bill-wave" },
    { id: "card", name: "Credit Card", icon: "fas fa-credit-card" },
    { id: "digital", name: "Digital Wallet", icon: "fas fa-mobile-alt" }
];

// Order types
const orderTypes = [
    { id: "dine-in", name: "Dine In", icon: "fas fa-chair" },
    { id: "delivery", name: "Delivery", icon: "fas fa-truck" },
    { id: "takeout", name: "Take Out", icon: "fas fa-shopping-bag" }
];

// Utility function to get products by category
function getProductsByCategory(category) {
    if (category === "all") return products;
    return products.filter(product => product.category === category);
}

// Utility function to get product by ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Utility function to get popular products
function getPopularProducts() {
    return products.filter(product => product.popular);
}

// Utility function to search products
function searchProducts(query) {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.ingredients.some(ingredient =>
            ingredient.toLowerCase().includes(lowercaseQuery)
        )
    );
}