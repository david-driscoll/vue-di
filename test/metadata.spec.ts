import { expect } from "chai";
import { ParentResolver } from "./../src/resolvers/ParentResolver";
import { Container } from '../src/container';

describe('Parent', () => {
    it('should return the key from the parent container when present', () => {
        let sut = new ParentResolver('test');
        let parent = new Container();
        let childContainer = parent.createChild();
        let instance = {};
        let wrongInstance = {};

        parent.registerInstance('test', instance);
        childContainer.registerInstance('test', wrongInstance);

        let result = sut.get(childContainer);

        expect(result).to.equal(instance);
        expect(result).not.to.equal(wrongInstance);
    });

    it('should return null when the parent container is not present', () => {
        let sut = new ParentResolver('test');
        let childContainer = new Container();
        let instance = {};

        childContainer.registerInstance('test', instance);
        expect(sut.get(childContainer)).to.be.null;
    });
});
