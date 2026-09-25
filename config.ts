export const DEFAULT_CONFIG = {
    imagesRoot: process.env.NEXT_PUBLIC_URL_IMAGES ? process.env.NEXT_PUBLIC_URL_IMAGES : "http://localhost:5000/public/uploads/",
    moneyConfig: {
        IGV: 0.18,
    },
    izipayConfig: {
        COMISSION_RATE_IZIPAY: 0.0344,
        CARGO_FIJO: 0.69
    },
    yapeConfig: {
        COMISSION_RATE_YAPE: 0.0349,
        CARGO_FIJO: 1.00
    }
}