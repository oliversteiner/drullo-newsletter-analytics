import {getModule, Module, MutationAction, VuexModule} from 'vuex-module-decorators'
import store from '@/store'
import * as api from '@/store/api'
import {Task, TaskRelated} from '@/store/models'
import * as moment from 'moment';
import 'moment/locale/de-ch';
moment.locale('de');

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

        // Compute Status


        let relatedList: TaskRelated[] = [];

        if (tasks) {
            tasks.map(task => {

                // Date
                task.changed =  moment.unix(task.changed);

                // Status
                task.statusMessage = TaskStatusMessage.DEFAULT

                if (task.done) {
                    task.status = TaskStatus.DONE
                    task.statusMessage = TaskStatusMessage.DONE
                } else {
                    task.status = TaskStatus.WAITING
                    task.statusMessage = TaskStatusMessage.WAITING

                }
            })


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
            taskList: tasks,
        }
    }
}

export default getModule(TasksModule)


export enum TaskStatus {
    DEFAULT = 'default',
    WAITING = 'waiting',
    WORKING = 'working',
    DONE = 'done',
    WARNING = 'warning',
    ERROR = 'error',
}

export enum TaskStatusMessage {
    DEFAULT = 'bereit',
    WAITING = 'wartet...',
    WORKING = 'wird ausgeführt...',
    DONE = 'beendet',
    WARNING = 'beendet mit Fehlern',
    ERROR = 'nicht ausgeführt',
}
