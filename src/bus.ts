import mitt from 'mitt'

export const events = mitt()

// 为总线添加类型
// type Events = {
//     foo: string;
//     bar: number;
// };
// export const fileEvents = mitt<Events>()