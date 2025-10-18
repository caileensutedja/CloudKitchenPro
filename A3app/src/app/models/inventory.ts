export class Inventory {
    inventoryId: string;
    userId: string;
    ingredientName: string;
    quantity: number;
    unit: string;
    category: string;
    purchaseDate: string;
    expirationDate: string;
    location: string;
    cost: number;
    daysLeft: number;
    soonExpired: boolean;
    createdAt: string;
    constructor(){
        this.inventoryId = '';
        this.userId = '';
        this.ingredientName = '';
        this.quantity = 0;
        this.unit = '';
        this.category = '';
        this.purchaseDate = '';
        this.expirationDate = '';
        this.location = '';
        this.cost = 0;
        this.daysLeft = 0;
        this.soonExpired = false;
        this.createdAt = '';
    }
}

