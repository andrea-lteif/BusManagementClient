import { Router, NavigationEnd } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
} from "@angular/core";
import { ROUTES } from "./sidebar-items";
import { AuthService } from "src/app/auth/services/auth.service";
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.sass"],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public sidebarItems: any[] = [];
  public innerHeight: any;
  public bodyTag: any;
  listMaxHeight: string;
  listMaxWidth: string;
  userFullName: string;
  userImg: string;
  userType: string;
  headerHeight = 60;
  currentRoute: string;
  routerObj = null;
  menuIcon = "radio_button_checked";
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private authService: AuthService,
    private router: Router
  ) {
    const body = this.elementRef.nativeElement.closest("body");
    this.routerObj = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // close sidebar on mobile screen after menu select
        this.renderer.removeClass(this.document.body, "overlay-open");
      }
    });
  }
  @HostListener("window:resize", ["$event"])
  windowResizecall(event) {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }
  @HostListener("document:mousedown", ["$event"])
  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, "overlay-open");
    }
  }
  callToggleMenu(event: any, length: any) {
    if (length > 0) {
      const parentElement = event.target.closest("li");
      const activeClass = parentElement.classList.contains("active");

      if (activeClass) {
        this.renderer.removeClass(parentElement, "active");
      } else {
        this.renderer.addClass(parentElement, "active");
      }
    }
  }
  ngOnInit() {
    // if (this.authService.currentUserValue) {
    //   this.userFullName =
    //     this.authService.currentUserValue.firstName +
    //     " " +
    //     this.authService.currentUserValue.lastName;
    //   this.userImg = this.authService.currentUserValue.img;
    //   this.userType = "Admin";
    // }
    if(this.authService.user?.claim == "Admin"){
      ROUTES.forEach(el => {
        this.sidebarItems.push(el);
      });
    }
    else{
      ROUTES.forEach(el =>{
        if(el.path == 'schedules/schedules' || el.path == '' || el.path=='schedules/purchased-tickets'){
          this.sidebarItems.push(el);
        }
      });
      //this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem.canAccess = false);
    }
    // this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem);
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
  }
  ngOnDestroy() {
    this.routerObj.unsubscribe();
  }
  initLeftSidebar() {
    const _this = this;
    // Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + "";
    this.listMaxWidth = "500px";
  }
  isOpen() {
    return this.bodyTag.classList.contains("overlay-open");
  }
  checkStatuForResize(firstTime) {
    if (window.innerWidth < 1170) {
      this.renderer.addClass(this.document.body, "ls-closed");
    } else {
      this.renderer.removeClass(this.document.body, "ls-closed");
    }
  }
  mouseHover(e) {
    const body = this.elementRef.nativeElement.closest("body");
    if (body.classList.contains("submenu-closed")) {
      this.renderer.addClass(this.document.body, "side-closed-hover");
      this.renderer.removeClass(this.document.body, "submenu-closed");
    }
  }
  mouseOut(e) {
    const body = this.elementRef.nativeElement.closest("body");
    if (body.classList.contains("side-closed-hover")) {
      this.renderer.removeClass(this.document.body, "side-closed-hover");
      this.renderer.addClass(this.document.body, "submenu-closed");
    }
  }
  mobileMenuSidebarOpen(event: any, className: string) {
    const hasClass = event.target.classList.contains(className);
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains("side-closed");
    if (hasClass) {
      this.renderer.removeClass(this.document.body, "side-closed");
      this.renderer.removeClass(this.document.body, "submenu-closed");
      this.menuIcon = "radio_button_checked";
    } else {
      this.renderer.addClass(this.document.body, "side-closed");
      this.renderer.addClass(this.document.body, "submenu-closed");
      this.menuIcon = "radio_button_unchecked";
    }

    const sideClosedHover =
      this.document.body.classList.contains("side-closed");
    if (sideClosedHover) {
      this.renderer.removeClass(this.document.body, "side-closed-hover");
    }
  }
  // logout() {
  //   this.authService.SignOut().subscribe((res) => {
  //     if (!res.success) {
  //       this.router.navigate(["/auth/login"]);
  //     }
  //   });
  // }
}
