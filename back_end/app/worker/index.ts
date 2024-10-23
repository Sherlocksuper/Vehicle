import {Worker} from "worker_threads";


export const getReplayWorker = () => {
  return new Worker('./replay.worker.js')
}
