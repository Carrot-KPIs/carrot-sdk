import { IPFS_GATEWAY, Fetcher as CoreFetcher } from '@carrot-kpi/sdk-core'
import { Cacher } from './cacher'

export abstract class Fetcher extends CoreFetcher {
  public static async fetchKpiTokenQuestions(cids: string[]): Promise<{ [cid: string]: string }> {
    const questions: { [cid: string]: string } = {}
    const uncachedCids = []
    for (const cid of cids) {
      const cachedQuestion = Cacher.get<string>(cid)
      if (!!cachedQuestion) questions[cid] = cachedQuestion
      else uncachedCids.push(cid)
    }
    if (uncachedCids.length > 0) {
      const uncachedQuestions = await Promise.all(
        uncachedCids.map(async (templateCid: string) => {
          const response = await fetch(IPFS_GATEWAY + templateCid)
          if (!response.ok) throw new Error(`could not fetch kpi token question with cid ${templateCid}`)
          return [templateCid, await response.text()]
        })
      )
      for (const [cid, question] of uncachedQuestions) {
        questions[cid] = question
        Cacher.set(cid, question, Number.MAX_SAFE_INTEGER) // valid forever (questions can't change)
      }
    }
    return questions
  }
}
