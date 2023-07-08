import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../shared/notification.service';
import { UserProfileModel } from './model/user-profile.model';
import { UserProfileService } from './data/user-profile.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  form: FormGroup;
  formErrors: any;
  loader = false;

  profile: UserProfileModel;

  photoToUpload: File = null;
  photoName: any;
  photoUrl = '';
  showPhoto: any;

  userId: string;


  constructor(private fb: FormBuilder, private route: ActivatedRoute,
              private userProfileService: UserProfileService, private notification: NotificationService ) {

    this.form = this.fb.group({
      branch: [{value: '', disabled: true}],
      role: [{value: '', disabled: true}],
      first_name: ['',
        [Validators.required,
          Validators.minLength(3)]],
      middle_name: [''],
      last_name: [''],
      email: [''],
      phone: [''],
      country: [''],
      city: [''],
      physical_address: [''],
      postal_address: [''],
      postal_code: [''],
      photo: [''],
      current_password: [''],
      password: [''],
      password_confirmation: ['']
    });
  }

  /**
   *
   */
  ngOnInit(): void {
    if (this.route.snapshot.data['profile']) {
      this.profile = this.route.snapshot.data['profile'].data;
      this.prePopulateForm(this.profile);
      this.userId = this.profile.id;
      // Fetch photo
      this.getImageFromService();
    }
  }

  /**
   *
   * @param profile
   */
  prePopulateForm(profile: UserProfileModel) {

    this.form.patchValue({
      branch: this.profile.branch.name,
      role: this.profile.role.display_name,
      first_name: this.profile.first_name,
      middle_name: this.profile.middle_name,
      last_name: this.profile.last_name,
      email: this.profile.email,
      phone: this.profile.phone,
      country: this.profile.country,
      city: this.profile.city,
      physical_address: this.profile.physical_address,
      postal_address: this.profile.postal_address,
      postal_code: this.profile.postal_code,
      photo: this.profile.photo
    });
  }

  onSubmit(){}

  /**
   *
   * @param file
   */
  onProfilePhotoSelect(file: FileList) {
    if (file.length > 0) {
      this.photoToUpload = file.item(0);
      this.photoName = file.item(0).name;
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.photoUrl = event.target.result;
      };
      reader.readAsDataURL(this.photoToUpload);

      this.loader = true;
      // upload to server

      const formData = new FormData();
      formData.append('photo', this.photoToUpload);
      formData.append('id',  this.userId);

      // Upload Photo
      this.uploadPhoto(formData);
    }
  }

  /**
   *
   */
  getImageFromService() {
    if (this.profile && this.profile.photo !== null) {
      this.userProfileService.fetchPhoto(this.profile.photo).subscribe(data => {
        this.createImageFromBlob(data);
      }, error => {
      });
    }
  }

  /**
   *
   * @param image
   */
  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.showPhoto = of(reader.result);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  /**
   * Upload profile image to server
   * @param formData
   */
  private uploadPhoto(formData: FormData) {
    // Upload photo
    this.userProfileService.updatePhoto(formData)
        .subscribe((data) => {
              this.loader = false;
              this.getImageFromService();
              // notify success
              this.notification.showNotification('success', 'Success !! Photo has been updated.');
            },
            (error) => {
              this.loader = false;
             // console.log('Error at Photo upload: ', error);
              if (error.payment === 0) {
                // notify error
                return;
              }
              // An array of all form errors as returned by server
              this.formErrors = error;

              if (this.formErrors) {
                // loop through from fields, If has an error, mark as invalid so mat-error can show
                for (const prop in this.formErrors) {
                  if (this.form) {
                    this.form.controls[prop].setErrors({incorrect: true});
                  }
                }
              }
            });
  }

  /**
   * 
   */
  update() {
    const body = Object.assign({}, this.profile, this.form.value);

    this.loader = true;
    this.userProfileService.update(body)
        .subscribe((data) => {
              this.loader = false;
              // notify success
              this.notification.showNotification('success', 'Success !! Profile has been updated.');

            },
            (error) => {
              this.loader = false;
              if (error.expense === 0) {
                // notify error
                return;
              }
              // An array of all form errors as returned by server
              this.formErrors = error;

              if (this.formErrors) {
                // loop through from fields, If has an error, mark as invalid so mat-error can show
                for (const prop in this.formErrors) {
                  if (this.form) {
                    this.form.controls[prop].setErrors({incorrect: true});
                  }
                }
              }
            });
  }

}
