import type { IPromotionProduct } from "./Promotion";

export interface IProduct{
    id?: number;
    name_product: string;
    brand: string;
    description: string;
    color: string;
    typeId: string;
    price: number;
    profilePicture: string;
    otherPictures: (string | undefined)[];
    technicalSpecification: string;
    availableQuantity: number,
    reservedQuantity : number,
    availability: boolean,
    promotionProducts?: IPromotionProduct[],
    isPublished: boolean;
}

export class Product implements IProduct{
    id?: number | undefined;
    name_product: string;
    brand: string;
    description: string;
    color: string;
    typeId: string;
    price: number;
    profilePicture: string;
    otherPictures: (string | undefined)[];
    technicalSpecification: string;
    availableQuantity: number;
    reservedQuantity : number;
    availability: boolean;
    promotionProducts?: IPromotionProduct[];
    isPublished: boolean;

    constructor(params: IProduct){
        this.id = params.id
        this.name_product = params.name_product;
        this.brand = params.brand;
        this.description = params.description;
        this.color = params.color;
        this.typeId = params.typeId;
        this.price = params.price;
        this.profilePicture = params.profilePicture;
        this.otherPictures = params.otherPictures;
        this.technicalSpecification = params.technicalSpecification;
        this.availableQuantity = params.availableQuantity;
        this.reservedQuantity = params.reservedQuantity;
        this.availability = params.availability;
        this.promotionProducts = params.promotionProducts;
        this.isPublished = params.isPublished;
    }

    getProfileURL(){
        return `${import.meta.env.VITE_LAMI_API_URL}images/${this.profilePicture}`
    }

    getOtherPicturesURL(){
        let URLs: string[] = []
        this.otherPictures.map((url)=>{
            if(url) URLs.push(`${import.meta.env.VITE_LAMI_API_URL}images/${url}`)
        })

        return URLs;
    }

    getPrice(){
        if(this.promotionProducts?.length){
            if(this.promotionProducts[0].promotion) return this.price - (this.price * (this.promotionProducts[0].promotion?.discount / 100))
            else return this.price
        }else return this.price
    }

    getStockStatus(){
       if(this.availableQuantity <= 0 ) return {
        style: 'color: red;',
        message: 'Rupture'
       }
       else if(this.availableQuantity <= 10) return {
        style: 'color: orange;',
        message: 'Critique'
       }
       else return {
        style: 'color: #10B981;',
        message: 'En stock'
       }
    }
}