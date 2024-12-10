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
    quantity: number;
    avaibility: boolean;
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
    quantity: number;
    avaibility: boolean;
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
        this.quantity = params.quantity;
        this.avaibility = params.avaibility;
        this.isPublished = params.isPublished;
    }

    getProfileURL(){
        return `${import.meta.env.VITE_LAMI_API_URL}images/${this.profilePicture}`
    }

    getOtherPicturesURL(){
        let URLs: string[] = []

        this.otherPictures.map((url)=>{
            if(url) URLs.push(url)
        })

        return URLs;
    }
}