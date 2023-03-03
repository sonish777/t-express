import Container from 'typedi';
import { Publisher } from './publisher';

export function InjectPublisher(fn: Function) {
    const originalMethod = fn;
    fn = async function (...args: any[]) {
        const publisher = Container.get<Publisher>(Publisher);
        return originalMethod.call(fn, publisher, ...args);
    };
    return fn;
}
