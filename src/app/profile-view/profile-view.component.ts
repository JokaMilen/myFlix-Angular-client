import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(public fetchApiData: FetchApiDataService, public dialogRef: MatDialogRef<ProfileViewComponent>) { }

  ngOnInit(): void {
    this.fetchApiData.getUser().subscribe((result) => {
      console.log(result);
      this.userData = result;
      this.userData.Password = '';
      this.userData.Birthday = this.userData.Birthday ? this.userData.Birthday.split('T')[0] : "";
    });
  }

  saveUser(): void {
    this.fetchApiData.updateUser(this.userData).subscribe((result) => {
      this.dialogRef.close();
      console.log(result);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}
