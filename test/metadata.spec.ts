import { expect } from 'chai';
import { Container } from '../src/container';
import { ParentResolver } from './../src/resolvers/ParentResolver';

describe('Parent', () => {
    it('should return the key from the parent container when present', () => {
        const sut = new ParentResolver('test');
        const parent = new Container();
        const childContainer = parent.createChild();
        const instance = {};
        const wrongInstance = {};

        parent.registerInstance('test', instance);
        childContainer.registerInstance('test', wrongInstance);

        const result = sut.get(childContainer);

        expect(result).to.equal(instance);
        expect(result).not.to.equal(wrongInstance);
    });

    it('should return null when the parent container is not present', () => {
        const sut = new ParentResolver('test');
        const childContainer = new Container();
        const instance = {};

        childContainer.registerInstance('test', instance);
        expect(sut.get(childContainer)).to.be.null;
    });
});
