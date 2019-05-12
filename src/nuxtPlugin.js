import Vue from 'vue';
import { Container } from 'vue-di';
import VueDi from 'vue-di/vue';
import { Store } from 'vuex'

export default (context, inject) => {
    const container = Container.instance || new Container();
    Vue.use(VueDi, { container });
    container.makeGlobal();
    context.container = context.app.container = container;
    container.registerInstance(Store, context.store);
}
