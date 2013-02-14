package pomf.rest


import org.specs2.Specification
import org.junit.runner.RunWith
import org.specs2.runner.JUnitRunner
import spray.testkit.Specs2RouteTest
import spray.http._
import StatusCodes._
import MediaTypes.`application/json`
import spray.httpx.SprayJsonSupport.{ sprayJsonMarshaller, sprayJsonUnmarshaller }
import java.util.Date
import java.text.SimpleDateFormat
import pomf.domain._
import JsonImplicits._

@RunWith(classOf[JUnitRunner]) // Only required if testing from within Eclipse
class PomfServiceSpec extends Specification with Specs2RouteTest with PomfService with TestDB {
  def actorRefFactory = system

  def is = {
    var string2NR = () // shadow implicit conversion from Spray Directives trait
    sequential^
    "Template Project REST Specification" ^
      p ^
      "For FRIDGE json objects" ^
      "Return a non-empty list if there some entities" ! getNonEmptyFridgeList ^
      p ^
      "For POST json objects" ^
      "Create a new entity" ! createPost ^
      "Read existing" ! readPost ^
      "Update existing" ! updatePost ^
      "Delete existing" ! deletePost ^
      "Handle missing fields" ! todo ^
      "Handle invalid fields" ! todo ^
      "Return error if the entity does not exist" ! todo ^
      end
  }

 
  val jsonPost = """{
      "author": "Jack",
      "content": "Yo dude",
      "color": "Blue",
      "date": "2012-02-11T12:13:56",
      "positionX": 0.5555,
      "positionY": 0.4444,
      "fridgeId": "Demo"}"""
    
    val jsonPostUpdate = """{
      "author": "Jack",
      "content": "Yo dude",
      "color": "Blue",
      "date": "2012-02-11T12:13:56",
      "positionX": 0.4444,
      "positionY": 0.4444,
      "fridgeId": "Demo"}"""  
    
    
  val dateFormatted = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse("2012-02-11T12:13:56")  

  val expectedPost = new Post(author = "Jack",
      					  content = "Yo dude",
      					  color = "Blue",
      					  date = dateFormatted,
      					  positionX = 0.5555d,
      					  positionY = 0.4444d,
      					  fridgeId = "Demo",
      					  id = Some(1L))
  
   val expectedUpdatedPost = new Post(author = "Jack",
      					  content = "Yo dude",
      					  color = "Blue",
      					  date = dateFormatted,
      					  positionX = 0.4444d,
      					  positionY = 0.4444d,
      					  fridgeId = "Demo",
      					  id = Some(1L))

  def getEmptyFridge = {
    Get("/fridge") ~> pomfRoute ~> check {
      entityAs[FridgeRest] === List()
      ok
    } 
  }
  
  def getNonEmptyFridgeList = {
    Get("/fridge") ~> pomfRoute ~> check {
      entityAs[FridgeRest] != null
      ok
    }
  }

  def createPost = {
    Post("/post", HttpBody(`application/json`, jsonPost)) ~> pomfRoute ~> check {
      entityAs[Post] === expectedPost
      ok
    }
  }
  
   def readPost = {
    Get("/post/1") ~> pomfRoute ~> check {
      entityAs[Post] === expectedPost
      ok
    }
  }
  
  def updatePost = {
    Put("/post", HttpBody(`application/json`, jsonPostUpdate)) ~> pomfRoute ~> check {
      entityAs[Post] === expectedUpdatedPost
      ok
    }
  }
  
  def deletePost = {
    Delete("/post/1") ~> pomfRoute ~> check {
      entityAs[Post] === "Post 1 deleted" 
      ok
    }
  }
}