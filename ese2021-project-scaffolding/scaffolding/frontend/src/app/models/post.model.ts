

export class Post {

  public pictureUploadedURL: any;

  constructor(
   public title: string,
   public category: string,
   public text: string,
   public creatorId: number, //should this be a user? username?
   public creatorUsername: string,
   public pictureLink: string,
   public pictureFile: File,
   public postId: number,
   public upvotes: number,
   public downvotes: number,
  ) {

    /*
    if (pictureFile != null) {
      let reader = new FileReader();
      reader.readAsDataURL(this.pictureFile);
      reader.onload = (_event) => {
        this.pictureUploadedURL = reader.result;
      }
    } */

    }
  }

