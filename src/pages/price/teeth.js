export const TREATMENTS = [
  { key: "oldirish", label: "Tish Oldirish" },
  { key: "plomba", label: "Plomba" },
  { key: "koronka", label: "Koronka" },
];


export const teethLayout = {
  upperRight: ["1","2","3","4","5","6","7","8"],
  upperLeft:  ["9","10","11","12","13","14","15","16"],
  lowerRight: ["17","18","19","20","21","22","23","24"],
  lowerLeft:  ["25","26","27","28","29","30","31","32"],
};


export const priceData = Object.fromEntries(
  Array.from({ length: 32 }).map((_, i) => {
    const toothId = String(i + 1);
    return [
      toothId,
      {
        "Tish Oldirish": 80000 + i * 500,
        Plomba: 120000 + i * 700,
        Koronka: 450000 + i * 1500,
      },
    ];
  })
);
