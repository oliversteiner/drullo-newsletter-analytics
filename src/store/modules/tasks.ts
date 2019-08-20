import {Module, VuexModule, getModule, Mutation, Action, MutationAction} from 'vuex-module-decorators'
import store from '@/store'
import * as api from '@/store/api'
import {Task} from "@/store/models";



@Module({
    dynamic: true,
    namespaced: true,
    name: 'tasks',
    store,
})
class TasksModule extends VuexModule {
    taskList: Task[] = [];

    @MutationAction
      async refreshTasklist() {
        console.log('refreshTasklist' );

        const taskListfromServer = await api.getTaskList();
        console.log('taskListfromServer', taskListfromServer);

        console.log('get from Server:', taskListfromServer.tasks);
        console.log('get from Server:', taskListfromServer.tasksCount);

        return {
            taskList: taskListfromServer.tasks
        }
    }
}


export default getModule(TasksModule);
