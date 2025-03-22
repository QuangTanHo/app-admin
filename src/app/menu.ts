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
        roles: ['2']
    },
    {
        name: "Manage User",
        icon: "fa-solid fa-user",
        url: "/manage-user",
        isTitle: false,
        subMenus: [],
        roles: ['1']
    },
    {
        name: "Order Product",
        icon: "fa-solid fa-order",
        url: "/order-product",
        isTitle: false,
        subMenus: [],
        roles: ['1']
    },
    {
        name: "test",
        icon: "fa-solid fa-order",
        url: "/test",
        isTitle: false,
        subMenus: [],
        roles: ['1']
    },
    // {
    //     name: "xe",
    //     icon: "fab fa-product-hunt",
    //     url: "/danh-sach-xe",
    //     isTitle: false,
    //     subMenus: [
    //         {
    //             name: "danh-sach-xe",
    //             icon: "fab fa-product-hunt",
    //             url: "/danh-sach-xe",
    //             isTitle: false,
    //             subMenus: [],
    //             roles: ['2']
    //         },
    //         {
    //             name: "them-xe",
    //             icon: "fas fa-plus",
    //             url: "/them-xe",
    //             isTitle: false,
    //             subMenus: [],
    //             roles: ['2']
    //         },
    //         {
    //             name: "danh-sach-hang-xe",
    //             icon: "fa fa-list-alt",
    //             url: "/danh-sach-hang-xe",
    //             isTitle: false,
    //             subMenus: [],
    //             roles: ['2']
    //         },
    //     ],
    //     roles: ['2']
    // },
    // {
    //     name: "manage-user",
    //     icon: "fa-solid fa-user",
    //     url: "/manage-user",
    //     isTitle: false,
    //     subMenus: [],
    //     roles: ['1']
    // }
]