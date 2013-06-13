package pomf.api

import pomf.util._
import akka.pattern._
import akka.actor._
import scala.concurrent.duration._
import pomf.domain.model._
import reflect.ClassTag
import JsonSupport._
import spray.json._
import spray.httpx.SprayJsonSupport._
import spray.routing._
import spray.http._
import spray.http.MediaTypes._
import spray.routing.Directive.pimpApply
import spray.util.SprayActorLogging
import DefaultJsonProtocol._
import pomf.service.CrudServiceActor


class ApiHttpActor extends HttpServiceActor with SprayActorLogging{
  implicit def executionContext = actorRefFactory.dispatcher
  implicit val timeout = akka.util.Timeout(60.seconds)

  def receive = runRoute(pomfRoute)
  
  private var crudService : ActorRef = _

  override def preStart() {
      crudService = actorRefFactory.actorFor("crud-router")
  }

  val pomfRoute =
    pathPrefix("api") {
      path("fridge" / Rest) { fridgeName =>
        get {
          complete {
            (crudService ? fridgeName).mapTo[FridgeRest]
          }
        }
      } ~
        path("fridge") {
          post {
            entity(as[Fridge]) { fridge =>
              complete {
                (crudService ? fridge).mapTo[Fridge]
              }
            }
          }
        } ~
        path("post") {
          post {
            parameters("token") { token =>
              entity(as[Post]) { post =>
                complete {
                  (crudService ? CrudServiceActor.CreatePost(post, token)).mapTo[Post]
                }
              }
            }
          } ~
            put {
              parameters("token") { token =>
                entity(as[Post]) { post =>
                  complete {
                    (crudService ? CrudServiceActor.UpdatePost(post, token)).mapTo[Post]
                  }
                }
              }
            }
        } ~
        path("post" / LongNumber) { postId =>
          get {
            complete {
              (crudService ? postId).mapTo[Option[Post]]
            }
          } ~
            delete {
              parameters("token") { token =>
                complete {
                  (crudService ? CrudServiceActor.DeletePost(postId, token)).mapTo[String]
                }
              }
            }
        } ~
        pathPrefix("rss") {
          path("fridge" / Rest) { fridgeName =>
            get {
              complete {
                (crudService ? CrudServiceActor.FridgeRss(fridgeName)).mapTo[scala.xml.Elem]
              }
            }
          }
        } ~
        pathPrefix("search") {
          path("fridge") {
            parameters("term") { term =>
              get {
                complete {
                  (crudService ? CrudServiceActor.SearchFridge(term)).mapTo[List[String]]
                }
              }
            }
          }
        } ~
        path("message" / Rest) { fridgeName =>
          post {
            parameters("token") { token =>
              entity(as[ChatMessage]) { message =>
                complete {
                  (crudService ? CrudServiceActor.PushChat(fridgeName, message, token)).mapTo[ChatMessage]
                }
              }
            }
          } ~
            get {
              complete {
                (crudService ? CrudServiceActor.ChatHistory(fridgeName)).mapTo[List[ChatMessage]]
              }
            }
        } ~
        path("token") {
          get {
            complete(TokenSupport.nextSessionId)
          }
        }
    }
}