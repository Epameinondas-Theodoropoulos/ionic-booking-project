export class Offer {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public price: number,
        public imageUrl: string,
        public availiableFrom: Date,
        public availiableTo: Date,
        public userId: string
    ){}
}