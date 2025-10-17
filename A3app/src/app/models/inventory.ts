export class Inventory {
    inventoryId: string;
    userId: string;
    ingredientName: string;
    quantity: number;
    unit: string;
    category: string;
    purchaseDate: string;
    expiration: string;
    location: string;
    cost: number;
    constructor(){
        this.inventoryId = '';
        this.userId = '';
        this.ingredientName = '';
        this.quantity = 0;
        this.unit = '';
        this.category = '';
        this.purchaseDate = '';
        this.expiration = '';
        this.location = '';
        this.cost = 0;
    }
}