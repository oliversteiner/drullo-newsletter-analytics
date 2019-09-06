import { Member, MolloMemberData, SubscriberStatus } from '@/models/models'
import { EnumsSubscriberStatus } from '@/enums'

/**
 *
 * STATUS:
 *  - none -> white outline
 *  - send -> white full
 *  - open -> green
 *  - error -> red ( email-address invalide)
 *  - unsubscribe -> viollet
 *  - warning -> orange (not definded)
 * @param data
 */
export default function getSubscriberStatus(data: MolloMemberData[]): SubscriberStatus[] {
  const status: SubscriberStatus[] = []

  // no Data
  if (!data) return status

  // Data
  data.forEach(data => {
    const message = {
      messageId: 0,
      // Default
      status: EnumsSubscriberStatus.NONE,
    }

    // Add Message ID
    if (data.messageId) {
      message.messageId = data.messageId
    }

    // Compute Status

    // Send
    if (data.sendTS != 0) message.status = EnumsSubscriberStatus.SEND
    if (data.send) message.status = EnumsSubscriberStatus.SEND

    // Open
    if (data.open) message.status = EnumsSubscriberStatus.OPEN

    // Unsubscribe
    if (data.unsubscribe) message.status = EnumsSubscriberStatus.UNSUBSCRIBE

    status.push(message)
  })

  return status
}
