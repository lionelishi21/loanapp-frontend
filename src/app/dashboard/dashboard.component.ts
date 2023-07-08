import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from './data/dashboard.service';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    loansDueColumns = [
        'loan_officer',
        'member_first_name',
        'member_last_name',
        'member_phone',
        'loan_reference_number',
        'loan_type_name',
        'totalDue'
    ];

    paymentColumns = [
        'member_id',
        'amount',
        'method_id',
        'payment_date'
    ];

    loanApplicationColumns = [
        'application_date',
        'member_id',
        'loan_type_id',
        'amount_applied'
    ];

    data: any;

    loaderDueToday = false;
    loaderOverDue = false;

    activeLoans: any;
    activeMembers: any;
    loansSum: any;
    totalOverDue: any;
    countLoanApplications: any;
    applicationsSum: any;

    latestPaymentsDataSource: any;
    loanApplicationsDataSource: any;
    loansDueTodayDataSource: any;
    loansOverDueDataSource: any;

    count_branches: any;
    current_branch: any;
    count_users: any;
    count_members: any;
    count_loans: any;
    count_loans_over_due: any;
    count_loans_due_today: any;
    count_loan_applications: any;

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService, private notification: NotificationService) {
      if (this.route.snapshot.data['summary']) {
          this.data = this.route.snapshot.data['summary'];
      }
  }

  startAnimationForLineChart(chart) {
      let seq: any, delays: any, durations: any;
      seq = 0;
      delays = 80;
      durations = 500;

      chart.on('draw', function(data) {
        if (data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if (data.type === 'point') {
              seq++;
              data.element.animate({
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'ease'
                }
              });
          }
      });

      seq = 0;
  };

  startAnimationForBarChart(chart) {
      let seq2: any, delays2: any, durations2: any;

      seq2 = 0;
      delays2 = 80;
      durations2 = 500;
      chart.on('draw', function(data) {
        if (data.type === 'bar') {
            seq2++;
            data.element.animate({
              opacity: {
                begin: seq2 * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
      });

      seq2 = 0;
  };

  ngOnInit() {
      if (this.data !== null) {
          this.current_branch = this.data.current_branch;
          this.count_branches = this.data.count_branches;
          this.count_users = this.data.count_users;
          this.count_members = this.data.count_members;
          this.count_loans = this.data.count_loans;
          this.count_loans_over_due = this.data.count_loans_over_due;
          this.count_loans_due_today = this.data.count_loans_due_today;
          this.count_loan_applications = this.data.count_loan_applications;


          this.activeLoans = this.data.count_loans;
          this.activeMembers = this.data.count_members;
          this.loansSum = this.data.loans_sum;
          this.totalOverDue = this.data.total_amount_over_due;

          this.countLoanApplications = this.data.count_pending_applications;
          this.applicationsSum = this.data.applications_sum;
          this.latestPaymentsDataSource = this.data.latest_payments;
          this.loanApplicationsDataSource = this.data.pending_applications;
          this.loansDueTodayDataSource = this.data.loans_due_today;
          this.loansOverDueDataSource = this.data.loans_over_due;
      }

      const dataDailySalesChart: any = {
          labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
          series: [
              [12, 17, 7, 17, 23, 18, 38]
          ]
      };

     const optionsDailySalesChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
      };

      const dataCompletedTasksChart: any = {
          labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
          series: [
              [230, 750, 450, 300, 280, 240, 200, 190]
          ]
      };

     const optionsCompletedTasksChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
      };

      var datawebsiteViewsChart = {
        labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
        series: [
          [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

        ]
      };
      var optionswebsiteViewsChart = {
          axisX: {
              showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
      };
      var responsiveOptions: any[] = [
        ['screen and (max-width: 640px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];
  }


    /**
     *
     */
    overDueReport() {
        this.loaderOverDue = true;
        this.dashboardService.downloadOverDueStatement({id: '', pdf: true})
            .subscribe((res) => {
                    this.loaderOverDue = false;
                    this.showFile(res);
                },
                () => {
                    this.loaderOverDue = false;
                    this.notification.showNotification('danger', 'Error Downloading File!');
                }
            );
    }

    /**
     *
     */
    dueTodayReport() {
        this.loaderDueToday = true;
        this.dashboardService.downloadDueTodayStatement({id: '', pdf: true})
            .subscribe((res) => {
                    this.loaderDueToday = false;
                    this.showFile(res);
                },
                () => {
                    this.loaderDueToday = false;
                    this.notification.showNotification('danger', 'Error Downloading File!');
                }
            );
    }

    /**
     *
     * @param blob
     */
    private showFile(blob){
        let newBlob = new Blob([blob], {type: "application/pdf"});

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }
        const data = window.URL.createObjectURL(newBlob);
        let link = document.createElement('a');
        link.href = data;
        link.download="loans_due.pdf";
        link.click();
        setTimeout(function(){
            window.URL.revokeObjectURL(data);
        }, 100);
    }

}
