import {Component, OnInit, Output} from '@angular/core';
import {UserService} from "../services/user.service";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Post} from "../models/post.model";
import {User} from "../models/user.model";
import {TodoList} from "../models/todo-list.model";

@Component({
  selector: 'app-community-post',
  templateUrl: './community-post.component.html',
  styleUrls: ['./community-post.component.css']
})
export class CommunityPostComponent implements OnInit {

  loggedIn: boolean | undefined;
  showNewPostWindow: boolean = false;
  showNewImageUrlField: boolean = false;
  newImageUrlButtonText = 'Link an image to your post!';
  allPosts: Post[] = []; //contains all communityPosts
  newPostTitle: string = '';
  newPostText: string = '';
  newPostCategory: string = '';
  newPictureLink: string = '';
  newPostFlag: any = false;
  newPostButtonTxt: string = "Create a new Post!";
  upvotes: number = 0;
  downvotes: number = 0;
  private user: User | undefined;
  fileSelected: boolean = false;
  image: any;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    this.user = userService.getUser();
  }

  ngOnInit(): void {
    this.readPosts();
  }

  newPost(): void {
    if(this.newPostButtonTxt === "Create a new Post!") {
      this.newPostButtonTxt = 'Cancel';
    } else {
      this.newPostButtonTxt = "Create a new Post!";
    }
    this.newPostFlag = !this.newPostFlag;
    this.showNewPostWindow = !this.showNewPostWindow;
  }

  publishButtonDisabled(): boolean{

    return (this.newPostText === '' && !this.fileSelected && this.newPictureLink === '') || this.newPostTitle === '' || this.newPostCategory === '';
  }


  publishPost(): void {
    this.httpClient.post(environment.endpointURL + "post", {
      creatorId: this.userService.getUser()?.userId || 0,
      title: this.newPostTitle,
      category: this.newPostCategory,
      text: this.newPostText,
      creatorUsername: this.userService.getUser()?.username || '',
      pictureLink: this.newPictureLink,
      pictureFile: this.image,
      upvotes: this.upvotes,
      downvotes: this.downvotes,

    }).subscribe((post: any) => {
      this.allPosts.push(new Post(post.title, post.category, post.text, post.creatorId, post.creatorUsername, post.pictureLink, post.pictureFile, post.postId, post.upvotes, post.downvotes));
      this.resetImage();
      this.newPostTitle= this.newPictureLink = this.newPostText = this.newPostCategory = '';
      this.newPost(); //resets the "new post window"
    })
  }

  readPosts(): void {
    this.httpClient.get(environment.endpointURL + "post").subscribe((posts: any) => {
      posts.forEach((post: any) => {
        this.allPosts.push(new Post(post.title, post.category, post.text, post.creatorId, post.creatorUsername, post.pictureLink, post.pictureFile, post.postId, post.upvotes, post.downvotes));
      })
    })
  }


  deletePost(post: Post): void{
    this.httpClient.delete(environment.endpointURL + "post/" + post.postId).subscribe(() => {
      this.allPosts.splice(this.allPosts.indexOf(post), 1);
    })

  }


  addImageByURL(): void {
    this.showNewImageUrlField = !this.showNewImageUrlField
    if (this.showNewImageUrlField){
      this.newImageUrlButtonText = "Cancel";
    } else {
      this.newImageUrlButtonText = "Link an image to your post!";
      this.newPictureLink = '';
    }
  }

  onFileChanged(event: any) {

    this.image = event.target.files[0];
    this.fileSelected = true;
  }

  resetImage() {
    this.image = null;
    this.fileSelected = false;
  }

}
