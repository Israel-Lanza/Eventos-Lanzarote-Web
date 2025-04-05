const categorias = {
    musicales: { display: "Musicales", sigla: "MU" },
    "talleres&cursos&conferencias": { display: "Talleres, cursos y conferencias", sigla: "TL" },
    exposiciones: { display: "Exposiciones", sigla: "EX" },
    gastrononicos: { display: "Gastronómicos", sigla: "GA" },
    infantiles: { display: "Infantiles", sigla: "IN" },
    tradicionales: { display: "Tradicionales", sigla: "TR" },
    "ferias&galas&festivales": { display: "Ferias, galas y festivales", sigla: "FE" },
    "artes-escenicas": { display: "Artes Escénicas", sigla: "AE" },
    deportivos: { display: "Deportivos", sigla: "DE" }
};

export const getDisplay = (valor) => {
    // Si el valor es un slug (clave en el objeto), devuelve directamente el display
    if (categorias[valor]) {
        return categorias[valor].display;
    }
    // En caso contrario, busca por sigla
    const encontrado = Object.values(categorias).find(categ => categ.sigla === valor);
    return encontrado ? encontrado.display : valor;
};

export default categorias;