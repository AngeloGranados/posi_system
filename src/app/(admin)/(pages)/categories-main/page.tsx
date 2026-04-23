import ContentCategories from "./(components-ui)/ContentCategories";

export default function CategoriesMain() {
    return (
        <div>
            <div>
                <h1 className="text-2xl font-bold">Configurar Categorías - Página Principal</h1>
                <p className="text-gray-600">Aquí puedes configurar las categorías que se mostrarán en la página principal.</p>
            </div>
            <div className="mt-10 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <ContentCategories />
            </div>        
        </div>
    )
}