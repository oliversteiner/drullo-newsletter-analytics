import {getModule, Module, MutationAction, VuexModule} from 'vuex-module-decorators'
import store from '@/store'
import * as api from '@/store/api'
import {Task, TaskRelated} from '@/store/models'

@Module({
    dynamic: true,
    namespaced: true,
    name: 'tasks',
    store,
})
class TasksModule extends VuexModule {
    taskList: Task[] = []
    relatedList: TaskRelated[] = []

    @MutationAction
    async refreshTasklist() {
        console.log('refreshTasklist')

        const taskListfromServer = await api.getTaskList()

      //  console.log('taskListfromServer', taskListfromServer)
      //  console.log('get from Server:', taskListfromServer.tasks)
      //  console.log('get from Server:', taskListfromServer.tasksCount)



        const tasks = taskListfromServer.tasks

        let relatedList: TaskRelated[] = [];

        if (tasks) {

            let uuid: string[] = []

            // return only first task of each related Task
            tasks.forEach(task => {
                if (-1 === uuid.indexOf(task.related)) {
                    uuid.push(task.related)

                    if (task.related) {
                        const related: TaskRelated = {
                            related: task.related,
                            message: task.message
                        }
                        relatedList.push(related)
                    }
                }
            })
        }

        console.log('relatedList', relatedList);

        //

        return {
            relatedList: relatedList,
            taskList: taskListfromServer.tasks,
        }
    }
}

export default getModule(TasksModule)
