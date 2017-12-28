import { expect } from 'chai';
import Vue from 'vue/';

import VueContainer from '../src/plugin';

describe('pluginTests', () => {
    it('should set the container', () => {
        const NewVue = Vue.extend({});
        NewVue.use(VueContainer);

        expect(Vue.container).to.be.undefined;
        expect(NewVue.container).to.not.be.null;
        NewVue.container.autoRegister.should.not.be.null;
    });
});
