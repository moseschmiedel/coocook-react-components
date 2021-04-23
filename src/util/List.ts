const contains: (
    list: Array<any>
) => (equals: (elem: any) => Boolean) => Boolean = (list: Array<any>) => (
    equals: (elem: any) => Boolean
) => list.filter(equals).length > 0;

export var List = {
    contains: contains,
};
