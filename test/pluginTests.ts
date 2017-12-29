import { autoinject, singleton, transient } from 'aurelia-dependency-injection';
import { expect } from 'chai';
import Vue from 'vue';

import VueContainer from '../src/plugin';

@autoinject
class Stuff {
    constructor() {

    }
    public value = 123;
}

@autoinject
class Item {
    constructor(public stuff: Stuff) {}
}

describe('pluginTests', () => {
    it('should set the container', () => {
        const NewVue = Vue.extend({});
        NewVue.use(VueContainer);

        expect(Vue.container).to.be.undefined;
        expect(NewVue.container).to.not.be.null;
        NewVue.container.autoRegister.should.not.be.null;
    });

    it('should setup dependendcies', () => {
        const NewVue = Vue.extend({});
        NewVue.use(VueContainer);

        const vm: any = new NewVue({
            dependencies: {
                things: Item /*?*/
            },
        });

        vm.things.should.not.be.null;
        vm.things.stuff.value.should.be.eq(123);
    });
});
