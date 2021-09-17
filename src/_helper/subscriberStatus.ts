import { EnumsSubscriberStatus } from '@/enums'
import { SubscriberStatus } from '@/_models/SubscriberClass'
import { MolloMemberTelemetry } from '@/_models/MolloMember'

/**
 *
 * STATUS:
 *  - none -> white outline
 *  - send -> white full
 *  - open -> green
 *  - error -> red ( email-address invalide)
 *  - unsubscribe -> viollet
 *  - warning -> orange (not definded)
 * @param telemetry
 */
export default function getSubscriberStatus(telemetry?: MolloMemberTelemetry[]): SubscriberStatus[] {
  const status: SubscriberStatus[] = []

  // no Data
  if (!telemetry) return []

  // Data
  telemetry.forEach(telemetry => {
    const message = {
      messageId: 0,
      // Default
      status: EnumsSubscriberStatus.NONE,
    }

    // Add Message ID
    if (telemetry.messageId) {
      message.messageId = telemetry.messageId
    }

    // Compute Status

    // Send
    if (telemetry.sendTS != 0) message.status = EnumsSubscriberStatus.SEND
    if (telemetry.send) message.status = EnumsSubscriberStatus.SEND

    // Open
    if (telemetry.open) message.status = EnumsSubscriberStatus.OPEN

    // Unsubscribe
    if (telemetry.unsubscribe) message.status = EnumsSubscriberStatus.UNSUBSCRIBE

    status.push(message)
  })

  return status
}
