export class MenuModel{
    name: string = '';
    icon: string = '';
    url: string = '';
    isTitle: boolean = false;
    subMenus: MenuModel[] = [];
    roles: string[]=[];
}

export const Menus: MenuModel[] = [
    {
        name: "Dashboard",
        icon: "fa-solid fa-home",
        url: "/",
        isTitle: false,
        subMenus: [],
        roles: ['1']
    },
    {
        name: "Product",
        icon: "fab fa-product-hunt",
        url: "/product-list",
        isTitle: false,
        subMenus: [
            {
                name: "Product List",
                icon: "fab fa-product-hunt",
                url: "/product-list",
                isTitle: false,
                subMenus: [],
                roles: ['1']
            },
            {
                name: "Add Product",
                icon: "fas fa-plus",
                url: "/add-product",
                isTitle: false,
                subMenus: [],
                roles: ['1']
            },
            {
                name: "Category List",
                icon: "fa fa-list-alt",
                url: "/category",
                isTitle: false,
                subMenus: [],
                roles: ['1']
            },
            {
                name: "Attribute List",
                icon: "fa fa-list-alt",
                url: "/attribute",
                isTitle: false,
                subMenus: [],
                roles: ['1']
            },
            
        ],
        roles: ['1']
    },
    {
        name: "manage-image",
        icon: "fa-solid fa-image",
        url: "/manage-image",
        isTitle: false,
        subMenus: [],
        roles: ['1']
    },
    {
        name: "manage-article",
        icon: "fa-solid fa-newspaper",
        url: "/list-article",
        isTitle: false,
        subMenus: [
            {
                name: "Article List",
                icon: "fab fa-product-hunt",
                url: "/list-article",
                isTitle: false,
                subMenus: [],
                roles: ['1']
            },
            {
                name: "Add Article",
                icon: "as fa-plus",
                url: "/add-article",
                isTitle: false,
                subMenus: [],
                roles: ['1']
            },
            
        ],
        roles: ['1']
    },
    {
        name: "manage-user",
        icon: "fa-solid fa-user",
        url: "/manage-user",
        isTitle: false,
        subMenus: [],
        roles: ['1']
    }
]