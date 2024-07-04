export class MenuModel{
    name: string = "";
    icon: string = "";
    url: string = "";
    isTitle: boolean = false;
    subMenus: MenuModel[] = [];
}

export const Menus: MenuModel[] = [
    {
        name: "Dashboard",
        icon: "fa-solid fa-home",
        url: "/",
        isTitle: false,
        subMenus: []
    },
    {
        name: "Product",
        icon: "fab fa-product-hunt",
        url: "/examples",
        isTitle: false,
        subMenus: [
            {
                name: "Product List",
                icon: "fab fa-product-hunt",
                url: "/product-list",
                isTitle: false,
                subMenus: []
            },
            {
                name: "Add Product",
                icon: "fas fa-plus",
                url: "/",
                isTitle: false,
                subMenus: []
            },
            {
                name: "Category List",
                icon: "fa fa-list-alt",
                url: "/",
                isTitle: false,
                subMenus: []
            },
        ]
    }
]