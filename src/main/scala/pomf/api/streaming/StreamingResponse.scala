package pomf.api.streaming

import akka.actor._
import spray.routing._
import spray.http._
import spray.http.MediaTypes._
import HttpHeaders._
import spray.can.Http
import spray.can.server.Stats
import scala.language.postfixOps
import pomf.api.JsonSupport._


class StreamingResponse(ctx: RequestContext) extends Actor with ActorLogging {

  val EventStreamType = register(
	  MediaType.custom(
	    mainType = "text",
	    subType = "event-stream",
	    compressible = false,
	    binary = false
	   ))

  def startText = "Starts streaming...\n"

  val responseStart = HttpResponse(
 			entity  = HttpEntity(EventStreamType, startText),
  		headers = `Cache-Control`(CacheDirectives.`no-cache`) :: Nil
      )

  ctx.responder ! ChunkedResponseStart(responseStart) 
  
  def receive = {
     
    case ev: Http.ConnectionClosed => {
      log.debug("Stopping response streaming due to {}", ev)
      context.stop(self)
    }
     
    case ReceiveTimeout =>
      ctx.responder ! MessageChunk(":\n") // Comment to keep connection alive  
  }
}