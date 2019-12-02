export class Place {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public imageUrl: string,
        public price: number,
        public availiableFrom: Date,
        public availiableTo: Date,
        public userId: string
    ){}
}